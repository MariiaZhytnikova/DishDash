import styled from "styled-components";
import homeContentData from "../data/homeContent.json";
import type { HomeContent } from "../types/home";

// Type-safe data extraction
const content = homeContentData as HomeContent;

const Container = styled.div`
	max-width: 800px;
	margin: 0 auto;
	padding: 48px 24px;
`;

const Header = styled.div`
	text-align: center;
	margin-bottom: 48px;
`;

const IconWrapper = styled.div`
	width: 80px;
	height: 80px;
	margin: 0 auto 24px;
	background: linear-gradient(135deg, #1fa9e4 0%, #0d8bc9 100%);
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 12px rgba(31, 169, 228, 0.3);
`;

const ChefIcon = styled.div`
	font-size: 48px;
	color: white;
	
	&::before {
		content: "👨‍🍳";
	}
`;

const Title = styled.h1`
	font-size: 2.5rem;
	font-weight: 700;
	color: #1a1a1a;
	margin: 0 0 16px 0;
`;

const Subtitle = styled.p`
	font-size: 1.125rem;
	color: #666;
	line-height: 1.6;
	max-width: 600px;
	margin: 0 auto;
`;

const InfoSection = styled.div`
	background: #f8f9fa;
	border-radius: 16px;
	padding: 32px;
	margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 16px 0;
	display: flex;
	align-items: center;
	gap: 8px;

	&::before {
		content: "✨";
		font-size: 1.25rem;
	}
`;

const Description = styled.p`
	font-size: 1rem;
	color: #4a4a4a;
	line-height: 1.7;
	margin: 0 0 16px 0;

	&:last-child {
		margin-bottom: 0;
	}
`;

const FeaturesSection = styled.div`
	margin-top: 48px;
`;

const FeaturesSectionTitle = styled.h2`
	font-size: 1.75rem;
	font-weight: 700;
	color: #1a1a1a;
	margin: 0 0 32px 0;
`;

const FeaturesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 24px;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`;

const FeatureCard = styled.div`
	background: white;
	border: 2px solid #e9ecef;
	border-radius: 16px;
	padding: 28px;
	transition: all 0.3s ease;

	&:hover {
		border-color: #1fa9e4;
		box-shadow: 0 4px 12px rgba(31, 169, 228, 0.15);
		transform: translateY(-2px);
	}
`;

const FeatureIcon = styled.div<{ $color: string }>`
	width: 48px;
	height: 48px;
	background: ${(p) => p.$color};
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16px;
	font-size: 24px;
`;

const FeatureTitle = styled.h3`
	font-size: 1.25rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 12px 0;
`;

const FeatureDescription = styled.p`
	font-size: 0.95rem;
	color: #666;
	line-height: 1.6;
	margin: 0;
`;

const HowItWorksSection = styled.div`
	margin-top: 64px;
	background: #f8f9fa;
	border-radius: 16px;
	padding: 40px;
`;

const HowItWorksTitle = styled.h2`
	font-size: 1.75rem;
	font-weight: 700;
	color: #1a1a1a;
	margin: 0 0 32px 0;
`;

const StepsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const StepItem = styled.div`
	display: flex;
	gap: 20px;
	align-items: flex-start;
`;

const StepNumber = styled.div`
	width: 40px;
	height: 40px;
	background: #1fa9e4;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.125rem;
	font-weight: 700;
	flex-shrink: 0;
`;

const StepContent = styled.div`
	flex: 1;
`;

const StepTitle = styled.h3`
	font-size: 1.125rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 8px 0;
`;

const StepDescription = styled.p`
	font-size: 0.95rem;
	color: #666;
	line-height: 1.6;
	margin: 0;
`;

const BenefitsSection = styled.div`
	margin-top: 64px;
`;

const BenefitsTitle = styled.h2`
	font-size: 1.75rem;
	font-weight: 700;
	color: #1a1a1a;
	margin: 0 0 32px 0;
`;

const BenefitsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

const BenefitItem = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
`;

const CheckIcon = styled.div`
	width: 24px;
	height: 24px;
	background: #10b981;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 2px;

	&::before {
		content: "✓";
		color: white;
		font-weight: 700;
		font-size: 14px;
	}
`;

const BenefitText = styled.p`
	font-size: 0.95rem;
	color: #4a4a4a;
	margin: 0;
	line-height: 1.6;
`;

const CallToActionSection = styled.div`
	margin-top: 64px;
	text-align: center;
	padding: 40px 24px;
`;

const CallToActionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0 0 12px 0;
`;

const CallToActionText = styled.p`
	font-size: 1rem;
	color: #1fa9e4;
	margin: 0;
	font-weight: 500;
`;

export function Home() {
	return (
		<Container>
			<Header>
				<IconWrapper>
					<ChefIcon />
				</IconWrapper>
				<Title>{content.hero.title}</Title>
				<Subtitle>{content.hero.subtitle}</Subtitle>
			</Header>

			<InfoSection>
				<SectionTitle>{content.whatIsDishDash.title}</SectionTitle>
				{content.whatIsDishDash.paragraphs.map((paragraph, index) => (
					<Description key={index}>{paragraph}</Description>
				))}
			</InfoSection>

			<FeaturesSection>
				<FeaturesSectionTitle>{content.featuresSection.title}</FeaturesSectionTitle>
				<FeaturesGrid>
					{content.featuresSection.features.map((feature) => (
						<FeatureCard key={feature.id}>
							<FeatureIcon $color={feature.color}>{feature.icon}</FeatureIcon>
							<FeatureTitle>{feature.title}</FeatureTitle>
							<FeatureDescription>{feature.description}</FeatureDescription>
						</FeatureCard>
					))}
				</FeaturesGrid>
			</FeaturesSection>

			<HowItWorksSection>
				<HowItWorksTitle>{content.howItWorksSection.title}</HowItWorksTitle>
				<StepsList>
					{content.howItWorksSection.steps.map((step) => (
						<StepItem key={step.id}>
							<StepNumber>{step.stepNumber}</StepNumber>
							<StepContent>
								<StepTitle>{step.title}</StepTitle>
								<StepDescription>{step.description}</StepDescription>
							</StepContent>
						</StepItem>
					))}
				</StepsList>
			</HowItWorksSection>

			<BenefitsSection>
				<BenefitsTitle>{content.benefitsSection.title}</BenefitsTitle>
				<BenefitsGrid>
					{content.benefitsSection.benefits.map((benefit) => (
						<BenefitItem key={benefit.id}>
							<CheckIcon />
							<BenefitText>{benefit.text}</BenefitText>
						</BenefitItem>
					))}
				</BenefitsGrid>
			</BenefitsSection>

			<CallToActionSection>
				<CallToActionTitle>{content.callToAction.title}</CallToActionTitle>
				<CallToActionText>{content.callToAction.text}</CallToActionText>
			</CallToActionSection>
		</Container>
	);
}
